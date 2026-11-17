import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PendingPanel from "@/components/valuation/PendingPanel";
import ValuationShell, { Block } from "@/components/valuation/ValuationShell";
import { airthread, valuationBase } from "@/data/valuation";

export const metadata: Metadata = {
  title: "AirThread Acquisition Valuation",
  description:
    "M&A case study: valuing AirThread Connections as an acquisition target using WACC, APV, and Flow to Equity.",
};

// Same five-section structure as the other project pages.
const sections = [
  { id: "business-problem", title: "Business Problem" },
  { id: "methodology", title: "Methodology" },
  { id: "analysis", title: "Analysis" },
  { id: "findings", title: "Findings" },
  { id: "implications", title: "Business Implications" },
];

const pending = <span className="text-xs tracking-[0.14em] text-sand-400 uppercase">Pending</span>;

export default function AirThreadCaseStudy() {
  const a = airthread;
  return (
    <ValuationShell
      crumbs={[
        { label: "Projects", href: "/#projects" },
        { label: "M&A Valuation", href: valuationBase },
        { label: "Case Study" },
      ]}
      eyebrow="Case Study"
      title="AirThread Acquisition Valuation"
      tagline="Valuing AirThread Connections as an acquisition target across the WACC, APV, and Flow to Equity frameworks."
      headerExtra={
        <div className="mt-8">
          <span className="inline-block rounded-full bg-ivory">
            <StatusBadge status={a.status} />
          </span>
        </div>
      }
    >
      <div className="mb-12 border-l-2 border-brass bg-sand-50 px-6 py-5 text-sm leading-relaxed text-stone-600">
        <span className="font-semibold text-navy-900">Status: {a.status}. </span>
        This case study is being built. Sections marked Pending will be filled in from the completed Excel model. No
        figures are shown until they come from that model.
      </div>

      <nav aria-label="On this page" className="mb-12">
        <p className="text-xs tracking-[0.2em] text-brass uppercase">On this page</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="inline-block border border-sand-200 bg-white px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-navy-900/40 hover:text-navy-900"
              >
                0{i + 1} {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <Block title="01 Business Problem" id="business-problem">
        <Label>Case context</Label>
        <Paragraphs items={a.overview} />
      </Block>

      <Block title="02 Methodology" id="methodology">
        <Label>Planned approach</Label>
        <div className="max-w-3xl leading-relaxed text-stone-600">
          <p>{a.methodology.intro}</p>
          <ul className="mt-4 space-y-3">
            {a.methodology.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-brass" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            Framework references:{" "}
            {a.outputs.map((o, i) => (
              <span key={o.method}>
                {i > 0 && " · "}
                <Link href={o.href} className="text-navy-900 underline-offset-4 hover:underline">
                  {o.method}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </Block>

      <Block title="03 Analysis" id="analysis">
        <div className="space-y-10">
          <Sub title="Excel valuation model">
            {a.excelModel.href ? (
              <a
                href={a.excelModel.href}
                download
                className="flex items-center justify-between gap-6 border border-sand-200 bg-white p-6 transition-colors hover:border-navy-900/40"
              >
                <div>
                  <p className="font-serif text-xl text-navy-900">{a.excelModel.fileName ?? "Valuation model"}</p>
                  {a.excelModel.description && (
                    <p className="mt-1 text-sm text-stone-600">{a.excelModel.description}</p>
                  )}
                </div>
                <span className="bg-navy-900 px-5 py-2.5 text-sm text-ivory">Download .xlsx</span>
              </a>
            ) : (
              <PendingPanel>The Excel valuation model will be available to download here once it is complete.</PendingPanel>
            )}
          </Sub>

          <Sub title="Key assumptions">
            <DataTable
              head={["Assumption", "Value", "Source / rationale"]}
              rows={a.assumptions.map((r) => [r.label, r.value ?? pending, r.source ?? pending])}
            />
          </Sub>

          <Sub title="Valuation outputs">
            <DataTable
              head={["Framework", "Enterprise value", "Equity value"]}
              rows={a.outputs.map((r) => [
                <Link key={r.method} href={r.href} className="text-navy-900 underline-offset-4 hover:underline">
                  {r.method}
                </Link>,
                r.enterpriseValue ?? pending,
                r.equityValue ?? pending,
              ])}
            />
          </Sub>

          <Sub title="Terminal value">
            <DataTable
              head={["Method", "Terminal value"]}
              rows={a.terminalValues.map((r) => [
                <Link key={r.method} href={r.href} className="text-navy-900 underline-offset-4 hover:underline">
                  {r.method}
                </Link>,
                r.value ?? pending,
              ])}
            />
          </Sub>

          <Sub title="Acquisition analysis">
            {a.acquisitionAnalysis.length ? (
              <Paragraphs items={a.acquisitionAnalysis} />
            ) : (
              <PendingPanel>The acquisition analysis will be added once the valuation is complete.</PendingPanel>
            )}
          </Sub>
        </div>
      </Block>

      <Block title="04 Findings" id="findings">
        {a.findings.length ? (
          <Paragraphs items={a.findings} />
        ) : (
          <PendingPanel>No findings yet. Results will be published only after the valuation is finished.</PendingPanel>
        )}
      </Block>

      <Block title="05 Business Implications" id="implications">
        {a.implications.length ? (
          <Paragraphs items={a.implications} />
        ) : (
          <PendingPanel>Business implications will be written once the findings are final.</PendingPanel>
        )}
      </Block>
    </ValuationShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-xs font-medium tracking-[0.2em] text-brass uppercase">{children}</p>;
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-serif text-2xl text-navy-900">{title}</h3>
      {children}
    </div>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="max-w-3xl space-y-4 leading-relaxed text-stone-600">
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto border border-sand-200 bg-white">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="border-b border-sand-200 bg-sand-50">
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-3 text-xs font-medium tracking-[0.14em] text-brass uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-sand-100 last:border-b-0">
              {r.map((c, j) => (
                <td key={j} className={`px-5 py-3.5 ${j === 0 ? "text-navy-900" : "text-stone-600 tabular-nums"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
