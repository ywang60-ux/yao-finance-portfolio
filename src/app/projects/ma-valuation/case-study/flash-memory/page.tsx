import type { Metadata } from "next";
import StatusBadge from "@/components/StatusBadge";
import {
  Bullets,
  CardGrid,
  FormulaList,
  KeyFigures,
  MethodSteps,
  Note,
  OnThisPage,
  Paragraphs,
  Questions,
  SourceNote,
  Sub,
} from "@/components/valuation/CaseParts";
import DataTable from "@/components/valuation/DataTable";
import ValuationShell, { Block } from "@/components/valuation/ValuationShell";
import { flashMemory as f } from "@/data/flashMemory";
import { valuationBase } from "@/data/valuation";

export const metadata: Metadata = {
  title: "Flash Memory: Investment and Financing",
  description: f.tagline,
};

export default function FlashMemoryCaseStudy() {
  return (
    <ValuationShell
      crumbs={[
        { label: "Projects", href: "/#projects" },
        { label: "M&A Valuation", href: valuationBase },
        { label: "Case Studies" },
        { label: "Flash Memory" },
      ]}
      eyebrow="Case Study · Capital Budgeting & Financing"
      title={f.title}
      tagline={f.tagline}
      headerExtra={
        <div className="mt-8">
          <span className="inline-block rounded-full bg-ivory">
            <StatusBadge status={f.status} />
          </span>
        </div>
      }
    >
      <SourceNote>{f.attribution}</SourceNote>
      <OnThisPage />

      <Block title="01 Business Problem" id="business-problem">
        <Paragraphs items={f.context} />
        <Sub title="Financing constraints">
          <CardGrid items={f.constraints} />
        </Sub>
        <Sub title="Key questions">
          <Questions items={f.questions} />
        </Sub>
      </Block>

      <Block title="02 Methodology" id="methodology">
        <MethodSteps items={f.methods} />
        <Sub title="Formulas used">
          <FormulaList items={f.formulas} />
        </Sub>
      </Block>

      <Block title="03 Analysis" id="analysis">
        <div className="space-y-12">
          <Sub title="Cost of capital" first>
            <DataTable
              caption="Cost of capital from comparable companies"
              head={f.costOfCapital.head}
              rows={f.costOfCapital.rows}
              highlightRow={f.costOfCapital.highlightRow}
            />
          </Sub>

          <Sub title="New product line: free cash flows" first>
            <DataTable
              caption="New product line free cash flows, $ thousands"
              head={f.projectCashFlows.head}
              rows={f.projectCashFlows.rows}
              highlightRow={f.projectCashFlows.highlightRow}
            />
            <div className="mt-6">
              <KeyFigures items={f.projectValue} accent="NPV" />
            </div>
            <Note>{f.projectValueNote}</Note>
          </Sub>

          <Sub title="Financing scenarios" first>
            <DataTable caption="Financing scenario comparison" head={f.scenarios.head} rows={f.scenarios.rows} />
            <Note>{f.scenariosNote}</Note>
          </Sub>
        </div>
      </Block>

      <Block title="04 Findings" id="findings">
        <Bullets items={f.findings} />
      </Block>

      <Block title="05 Business Implications" id="implications">
        <Bullets items={f.implications} />
      </Block>
    </ValuationShell>
  );
}
