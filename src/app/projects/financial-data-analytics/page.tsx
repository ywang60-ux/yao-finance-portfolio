import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import StatusBadge from "@/components/StatusBadge";
import TopicList from "@/components/TopicList";
import PromotionDashboard from "@/components/dashboard/PromotionDashboard";
import {
  Bullets,
  FormulaList,
  MethodSteps,
  Note,
  OnThisPage,
  Paragraphs,
  Questions,
  SourceNote,
  Sub,
} from "@/components/valuation/CaseParts";
import { Block } from "@/components/valuation/ValuationShell";
import { getProject } from "@/data/projects";
import { promotionAnalysis as a } from "@/data/promotionAnalysis";

const project = getProject("financial-data-analytics")!;

export const metadata: Metadata = {
  title: `${project.category}: ${project.title}`,
  description: project.summary,
};

export default function FinancialDataAnalyticsPage() {
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
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.08] font-medium sm:text-6xl">{a.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand-200">{a.tagline}</p>
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

      {/* Interactive dashboard, full container width */}
      <section aria-labelledby="dashboard-title" className="bg-sand-50 py-14 sm:py-16">
        <Container>
          <SourceNote>{a.attribution}</SourceNote>
          <p className="text-xs tracking-[0.25em] text-brass uppercase">Interactive dashboard</p>
          <h2 id="dashboard-title" className="mt-2 font-serif text-4xl text-navy-900">
            Promotion performance
          </h2>
          <p className="mt-2 mb-8 max-w-2xl text-sm leading-relaxed text-stone-600">
            Use the filters to explore by year, day type, region, and product. Every number below is recalculated from
            the underlying sales data.
          </p>
          <PromotionDashboard />
        </Container>
      </section>

      <div className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <OnThisPage />

          <Block title="01 Business Problem" id="business-problem">
            <Paragraphs items={a.context} />
            <Sub title="Key questions">
              <Questions items={a.questions} />
            </Sub>
          </Block>

          <Block title="02 Methodology" id="methodology">
            <MethodSteps items={a.methods} />
            <Sub title="DAX measures">
              <FormulaList items={a.formulas} />
              <Note>{a.metricNote}</Note>
            </Sub>
          </Block>

          <Block title="03 Analysis" id="analysis">
            <Paragraphs
              items={[
                "The analysis is the interactive dashboard above. It reproduces both pages of the Power BI report: the summary page (KPIs, promotion comparison, and the summary table) and the drill-through page (the product breakdown for a selected promotion).",
              ]}
            />
          </Block>

          <Block title="04 Findings" id="findings">
            <Bullets items={a.findings} />
          </Block>

          <Block title="05 Business Implications" id="implications">
            <Bullets items={a.implications} />
          </Block>
        </Container>
      </div>
    </>
  );
}
