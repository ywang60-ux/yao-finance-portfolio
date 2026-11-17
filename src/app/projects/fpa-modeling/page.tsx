import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import StatusBadge from "@/components/StatusBadge";
import TopicList from "@/components/TopicList";
import { ContractorModel, HeadcountModel, RevenueModel } from "@/components/fpa/FpaCalculators";
import { FormulaList, Paragraphs, SourceNote, Sub } from "@/components/valuation/CaseParts";
import { Block } from "@/components/valuation/ValuationShell";
import { getProject } from "@/data/projects";
import { fpaModeling as f } from "@/data/fpaModeling";

const project = getProject("fpa-modeling")!;

export const metadata: Metadata = {
  title: `${project.category}: ${project.title}`,
  description: project.summary,
};

const calculators: Record<string, React.ReactNode> = {
  revenue: <RevenueModel />,
  headcount: <HeadcountModel />,
  contractors: <ContractorModel />,
};

export default function FpaModelingPage() {
  return (
    <>
      <header className="bg-navy-900 pt-32 pb-16 text-ivory sm:pt-40 sm:pb-20">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-sand-200">
            <Link href="/#projects" className="transition-colors hover:text-ivory">
              Projects
            </Link>
            <span className="mx-2 text-sand-400" aria-hidden>
              /
            </span>
            <span className="text-ivory" aria-current="page">
              {project.category}
            </span>
          </nav>
          <p className="mt-10 text-xs font-medium tracking-[0.25em] text-brass-light uppercase">
            Project {project.number} · {project.category}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.08] font-medium sm:text-6xl">{f.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-200">{f.tagline}</p>
          <div className="mt-8">
            <span className="inline-block rounded-full bg-ivory">
              <StatusBadge status={project.status} />
            </span>
          </div>
          <div className="mt-8">
            <p className="mb-3 text-xs tracking-[0.2em] text-sand-400 uppercase">Topics</p>
            <TopicList topics={project.topics} tone="dark" />
          </div>
        </Container>
      </header>

      <div className="py-16 sm:py-20">
        <Container className="max-w-5xl">
          <SourceNote>{f.attribution}</SourceNote>

          {/* Contents */}
          <nav aria-label="On this page" className="mb-12">
            <p className="text-xs tracking-[0.2em] text-brass uppercase">On this page</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[{ id: "overview", title: "Model Overview", status: null }, ...f.analyses.map((a) => ({ id: a.id, title: a.title, status: a.status }))].map(
                (s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="inline-flex items-center gap-2 border border-sand-200 bg-white px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-navy-900/40 hover:text-navy-900"
                    >
                      0{i + 1} {s.title}
                      {s.status === "In Progress" && <span className="text-[0.6rem] tracking-wider text-sand-400 uppercase">In progress</span>}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <Block title="01 Model Overview" id="overview">
            <Paragraphs items={f.overview} />
            <Sub title="How the model flows">
              <ol className="flex flex-wrap items-center gap-2 text-sm">
                {f.flow.map((step, i) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="border border-sand-200 bg-white px-3 py-1.5 text-navy-900">{step}</span>
                    {i < f.flow.length - 1 && (
                      <span className="text-sand-400" aria-hidden>
                        →
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </Sub>
          </Block>

          {f.analyses.map((a, i) => (
            <Block key={a.id} title={`0${i + 2} ${a.title}`} id={a.id}>
              <div className="-mt-2 mb-6 flex flex-wrap items-center gap-3">
                <StatusBadge status={a.status} />
                {a.part && <span className="text-xs tracking-[0.16em] text-stone-600 uppercase">FP&amp;A Modeling {a.part}</span>}
              </div>
              <p className="max-w-3xl font-serif text-2xl leading-snug text-navy-900">{a.question}</p>

              <Sub title="How the logic works">
                <ol className="max-w-3xl space-y-3">
                  {a.steps.map((s, j) => (
                    <li key={s} className="flex gap-4 leading-relaxed text-stone-600">
                      <span className="font-serif text-xl leading-none text-brass">{j + 1}</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ol>
              </Sub>

              <Sub title="Formulas">
                <FormulaList items={a.formulas} />
              </Sub>

              {calculators[a.id] ? (
                <Sub title="Try it">{calculators[a.id]}</Sub>
              ) : (
                <div className="mt-10 border border-dashed border-sand-400/70 bg-sand-50 p-6 text-sm leading-relaxed text-stone-600">
                  <span className="font-semibold text-navy-900">In progress. </span>
                  This part of the model is still being built. An interactive version will be added once it is complete.
                </div>
              )}
            </Block>
          ))}

          <Block title="Skills demonstrated">
            <ul className="flex flex-wrap gap-2">
              {f.skills.map((s) => (
                <li key={s} className="border border-sand-200 bg-white px-3 py-1.5 text-sm text-navy-900">
                  {s}
                </li>
              ))}
            </ul>
          </Block>
        </Container>
      </div>
    </>
  );
}
