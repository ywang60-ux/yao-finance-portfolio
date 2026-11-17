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
import { ferrari as f } from "@/data/ferrari";
import { valuationBase } from "@/data/valuation";

export const metadata: Metadata = {
  title: "Ferrari: The 2015 IPO",
  description: f.tagline,
};

export default function FerrariCaseStudy() {
  return (
    <ValuationShell
      crumbs={[
        { label: "Projects", href: "/#projects" },
        { label: "M&A Valuation", href: valuationBase },
        { label: "Case Studies" },
        { label: "Ferrari IPO" },
      ]}
      eyebrow="Case Study · IPO Valuation"
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
        <Sub title="Key issues">
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
          <Sub title="Comparable company multiples" first>
            <DataTable
              caption="EV/EBITDA by peer group"
              head={f.multiples.head}
              rows={f.multiples.rows}
              highlightRow={f.multiples.highlightRow}
            />
            <Note>{f.multiplesNote}</Note>
          </Sub>

          <Sub title="Free cash flow forecast" first>
            <DataTable
              caption="Ferrari free cash flow forecast, € millions"
              head={f.cashFlows.head}
              rows={f.cashFlows.rows}
              highlightRow={f.cashFlows.highlightRow}
            />
            <Note>{f.cashFlowsNote}</Note>
          </Sub>

          <Sub title="Valuation summary" first>
            <DataTable
              caption="Ferrari valuation by method"
              head={f.valuation.head}
              rows={f.valuation.rows}
              highlightRow={f.valuation.highlightRow}
            />
            <div className="mt-6">
              <KeyFigures items={f.keyFigures} accent="Value range" />
            </div>
            <Note>{f.keyFiguresNote}</Note>
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
