import type { Metadata } from "next";
import Link from "next/link";
import { CardGrid, Note } from "@/components/valuation/CaseParts";
import DataTable from "@/components/valuation/DataTable";
import ValuationShell, { Block } from "@/components/valuation/ValuationShell";
import { acquisitionFramework as a } from "@/data/acquisitionFramework";
import { valuationBase } from "@/data/valuation";

export const metadata: Metadata = {
  title: a.title,
  description: a.tagline,
};

export default function AcquisitionFrameworkPage() {
  return (
    <ValuationShell
      crumbs={[
        { label: "Projects", href: "/#projects" },
        { label: "M&A Valuation", href: valuationBase },
        { label: "Acquisition Framework" },
      ]}
      eyebrow="M&A Valuation · Deal Structure"
      title={a.title}
      tagline={a.tagline}
    >
      <p className="mb-12 max-w-3xl font-serif text-2xl leading-snug text-navy-900">{a.intro}</p>

      <Block title="1. Acquisition Methods" id="methods">
        <p className="-mt-2 mb-6 text-sm tracking-wide text-stone-600">What is being acquired?</p>
        <div className="grid gap-4 md:grid-cols-2">
          {a.methods.map((m) => (
            <div key={m.title} className="border border-sand-200 bg-white p-6">
              <p className="font-serif text-2xl text-navy-900">{m.title}</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-stone-600">
                {m.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="mt-2.5 h-px w-3 shrink-0 bg-brass" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <Block title="2. Acquisition Structures" id="structures">
        <p className="-mt-2 mb-6 text-sm tracking-wide text-stone-600">How is the deal executed?</p>
        <div className="grid gap-4 md:grid-cols-2">
          <StructureCard title="Direct Acquisition" text={a.structures.direct}>
            <Diagram mode="direct" />
          </StructureCard>
          <StructureCard title="Acquisition Subsidiary (NewCo / BuyCo)" text={a.structures.subsidiary}>
            <Diagram mode="subsidiary" />
          </StructureCard>
        </div>

        <p className="mt-8 mb-4 text-xs tracking-[0.2em] text-brass uppercase">Common structures</p>
        <div className="grid gap-4 md:grid-cols-2">
          {a.structures.triangular.map((t) => (
            <StructureCard key={t.title} title={t.title} text={t.text}>
              <Diagram mode={t.survivor === "sub" ? "forward" : "reverse"} />
            </StructureCard>
          ))}
        </div>
        <p className="mt-6 border-l-2 border-brass bg-sand-50 px-5 py-4 text-sm leading-relaxed text-stone-600">{a.structures.note}</p>
      </Block>

      <Block title="3. Tax Treatment" id="tax">
        <p className="-mt-2 mb-6 text-sm tracking-wide text-stone-600">What are the tax implications?</p>
        <DataTable caption="Tax treatment by acquisition structure" head={["Structure", "General tax consideration"]} rows={a.tax.rows} alignLeft />
        <Note>
          <em>Note: {a.tax.note}</em>
        </Note>
      </Block>

      <Block title="4. Valuation Implications" id="valuation">
        <p className="-mt-2 mb-6 text-sm tracking-wide text-stone-600">How does structure affect value? When evaluating an acquisition, consider:</p>
        <CardGrid items={a.valuation} />
        <p className="mt-6 text-sm text-stone-600">
          These effects flow into the valuation frameworks in this project:{" "}
          <Link href={`${valuationBase}/frameworks/apv`} className="text-navy-900 underline-offset-4 hover:underline">
            APV
          </Link>{" "}
          values tax shields separately, while{" "}
          <Link href={`${valuationBase}/frameworks/wacc`} className="text-navy-900 underline-offset-4 hover:underline">
            WACC
          </Link>{" "}
          and{" "}
          <Link href={`${valuationBase}/frameworks/fte`} className="text-navy-900 underline-offset-4 hover:underline">
            Flow to Equity
          </Link>{" "}
          capture them in after-tax cash flows and discount rates.
        </p>
      </Block>

      <section className="mt-6 bg-navy-900 px-6 py-8 text-ivory sm:px-8" aria-labelledby="takeaway">
        <p id="takeaway" className="text-xs tracking-[0.25em] text-brass-light uppercase">
          Key takeaway
        </p>
        <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug">{a.takeaway}</p>
      </section>
    </ValuationShell>
  );
}

function StructureCard({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col border border-sand-200 bg-white p-6">
      <p className="font-serif text-xl text-navy-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{text}</p>
      <div className="mt-5 flex flex-1 items-end">{children}</div>
    </div>
  );
}

/** Small entity diagrams. The surviving entity is drawn in solid navy. */
function Diagram({ mode }: { mode: "direct" | "subsidiary" | "forward" | "reverse" }) {
  const box = (label: string, kind: "buyer" | "survives" | "merges" | "plain") => (
    <span
      className={`inline-flex min-w-[5.5rem] items-center justify-center px-3 py-2 text-xs font-medium ${
        kind === "buyer"
          ? "border border-navy-900 bg-white text-navy-900"
          : kind === "survives"
            ? "bg-navy-900 text-ivory"
            : kind === "merges"
              ? "border border-dashed border-stone-600/50 bg-sand-50 text-stone-600"
              : "border border-sand-200 bg-sand-50 text-navy-900"
      }`}
    >
      {label}
    </span>
  );
  const down = (label?: string) => (
    <span className="flex flex-col items-center py-1 text-[0.65rem] text-stone-600" aria-hidden>
      <span className="h-3 w-px bg-stone-600/50" />
      {label && <span className="py-0.5">{label}</span>}
      <span className="leading-none">▼</span>
    </span>
  );

  if (mode === "direct") {
    return (
      <div className="flex w-full flex-col items-center" role="img" aria-label="Buyer acquires the target's assets or shares directly">
        {box("Buyer", "buyer")}
        {down("buys assets or shares")}
        {box("Target", "plain")}
      </div>
    );
  }
  if (mode === "subsidiary") {
    return (
      <div className="flex w-full flex-col items-center" role="img" aria-label="Buyer forms an acquisition subsidiary, which acquires the target">
        {box("Buyer", "buyer")}
        {down("forms")}
        {box("NewCo / BuyCo", "plain")}
        {down("acquires")}
        {box("Target", "plain")}
      </div>
    );
  }
  const forward = mode === "forward";
  return (
    <div className="w-full" role="img" aria-label={forward ? "Target merges into the subsidiary; the subsidiary survives" : "Subsidiary merges into the target; the target survives"}>
      <div className="flex flex-col items-center">
        {box("Buyer", "buyer")}
        {down("owns")}
        <div className="flex items-center gap-2">
          {box("Sub", forward ? "survives" : "merges")}
          <span className="text-xs text-stone-600" aria-hidden>
            {forward ? "◀ merges into" : "merges into ▶"}
          </span>
          {box("Target", forward ? "merges" : "survives")}
        </div>
      </div>
      <p className="mt-3 text-center text-[0.7rem] text-stone-600">
        Surviving entity: <span className="font-semibold text-navy-900">{forward ? "the acquisition subsidiary" : "the target"}</span>
      </p>
    </div>
  );
}
